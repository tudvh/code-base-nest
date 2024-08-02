import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { extname } from 'path'

@Injectable()
export class S3Service {
  private s3Client: S3Client

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('awsRegion'),
    })
  }

  async upload(file: Express.Multer.File): Promise<any> {
    const bucketName = this.configService.get('awsS3BucketName')
    const region = this.configService.get('awsRegion')
    const uniqueSuffix = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('')
    const ext = extname(file.originalname)
    const fileName = `${uniqueSuffix}${ext}`

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
      }),
    )

    return {
      fileName,
      url: `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`,
    }
  }

  async remove(fileName: string): Promise<void> {
    try {
      if (!fileName) return

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.get('awsS3BucketName'),
          Key: fileName,
        }),
      )
    } catch (err) {
      console.log(err)
    }
  }
}
