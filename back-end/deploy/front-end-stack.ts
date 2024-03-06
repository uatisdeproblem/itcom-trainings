import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as S3 from 'aws-cdk-lib/aws-s3';
import * as CloudFront from 'aws-cdk-lib/aws-cloudfront';
import * as ACM from 'aws-cdk-lib/aws-certificatemanager';
import * as Route53 from 'aws-cdk-lib/aws-route53';
import * as Route53Targets from 'aws-cdk-lib/aws-route53-targets';
import { RemovalPolicy } from 'aws-cdk-lib';

export interface FrontEndProps extends cdk.StackProps {
  project: string;
  stage: string;
  domain: string;
}

export class FrontEndStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontEndProps) {
    super(scope, id, props);

    const frontEndBucket = new S3.Bucket(this, 'Bucket', {
      bucketName: 'idea-'.concat(props.project, '-', props.stage, '-front-end'),
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ALL
    });
    new cdk.CfnOutput(this, 'frontEndS3Bucket', { value: frontEndBucket.bucketName });

    const zone = Route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domain.split('.').slice(-2).join('.')
    });

    const certificate = new ACM.DnsValidatedCertificate(this, 'Certificate', {
      domainName: props.domain,
      hostedZone: zone,
      region: 'us-east-1'
    });

    const originAccessIdentity = new CloudFront.OriginAccessIdentity(this, 'DistributionOAI', {
      comment: `OAI for https://${props.domain}`
    });
    frontEndBucket.grantRead(originAccessIdentity);

    const frontEndDistribution = new CloudFront.CloudFrontWebDistribution(this, 'Distribution', {
      originConfigs: [
        {
          s3OriginSource: { s3BucketSource: frontEndBucket, originAccessIdentity },
          behaviors: [
            { isDefaultBehavior: true, defaultTtl: cdk.Duration.days(1), maxTtl: cdk.Duration.days(1), compress: true }
          ]
        }
      ],
      viewerProtocolPolicy: CloudFront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      priceClass: CloudFront.PriceClass.PRICE_CLASS_100,
      errorConfigurations: [
        { errorCachingMinTtl: 0, errorCode: 403, responseCode: 200, responsePagePath: '/index.html' },
        { errorCachingMinTtl: 0, errorCode: 404, responseCode: 200, responsePagePath: '/index.html' }
      ],
      viewerCertificate: CloudFront.ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [props.domain],
        securityPolicy: CloudFront.SecurityPolicyProtocol.TLS_V1_2_2021
      })
    });
    // temporary: `CloudFrontWebDistribution` doesn't support Security Headers during setup (unlike `Distribution`);
    // hence, we use this workaround: https://stackoverflow.com/questions/72306740
    (frontEndDistribution.node.defaultChild as CloudFront.CfnDistribution).addPropertyOverride(
      'DistributionConfig.DefaultCacheBehavior.ResponseHeadersPolicyId',
      CloudFront.ResponseHeadersPolicy.SECURITY_HEADERS.responseHeadersPolicyId
    );
    new cdk.CfnOutput(this, 'frontEndDistribution', { value: frontEndDistribution.distributionId });

    new Route53.ARecord(this, 'DomainRecord', {
      zone: zone,
      recordName: props.domain,
      target: Route53.RecordTarget.fromAlias(new Route53Targets.CloudFrontTarget(frontEndDistribution))
    });
  }
}
