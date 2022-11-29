sealed class UploadFileStatus{
    data class FileStatus(val status: Int): UploadFileStatus()
    data class Error(val exception: Throwable): UploadFileStatus()
    data class Complete(val s3Url: String): UploadFileStatus()
    data class Start(val start: Boolean): UploadFileStatus()
}

class UploadService : JobIntentService() {

    private val secrets = getSecrets()

    override fun onHandleWork(intent: Intent) {
        if (intent.extras?.containsKey(IMAGE_URI) == true) {
            val imageUri = intent.getParcelableExtra<Uri>(IMAGE_URI)
            var image: Bitmap? = null
            if (imageUri != null) {
                image = MediaStore.Images.Media.getBitmap(contentResolver, imageUri)
            }
            val file = image?.let { createFile(this, System.currentTimeMillis().toString(), "Uploaded Files", bitmap = it) }
            if (file != null) {
                val extension = file.absolutePath.toString().split(".").last()
                file?.absolutePath?.let { it2 -> s3Upload(it2, this, extension) }
            }
        }
    }

    private fun s3Upload(path: String, context: Context, extension: String = "jpeg", fileName: String = System.currentTimeMillis().toString()) {
        val policy: StrictMode.ThreadPolicy = StrictMode.ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)
        val credentials = BasicAWSCredentials(secrets.awsAccessKey, secrets.awsSecretKey)
        val s3 = AmazonS3Client(credentials)
        java.security.Security.setProperty("networkaddress.cache.ttl","60")
        s3.setRegion(Region.getRegion(Regions.US_WEST_2))
        s3.endpoint = secrets.awsEndpoint
        val transferUtility = TransferUtility.builder()
            .defaultBucket(
                secrets.s3BucketName)
            .context(context).s3Client(s3).build()
        val file = File(path)
        val uploadObserver =
            transferUtility.upload(
                secrets.s3BucketName,
                "$fileName.$extension",
                file,
                CannedAccessControlList.PublicRead
            )

        val transferListener = object : TransferListener {
            override fun onStateChanged(id: Int, state: TransferState)  {
                if (state == TransferState.COMPLETED) {
                    val url = "${secrets.s3BaseUrl}/$fileName.$extension"
                    LiveSubject.FILE_UPLOAD_FILE.onNext(UploadFileStatus.Complete(url))
                }
            }
            override fun onProgressChanged(id: Int, current: Long, total: Long) {
                val status = (((current.toDouble() / total) * 100.0).toInt())
                LiveSubject.FILE_UPLOAD_FILE.onNext(UploadFileStatus.FileStatus(status))
            }
            override fun onError(id: Int, ex: Exception) {
                LiveSubject.FILE_UPLOAD_FILE.onNext(UploadFileStatus.Error(ex))
            }
        }

        uploadObserver.setTransferListener(transferListener)

    }
    
    companion object {
        /**
         * Unique job ID for this service.
         */
        const val JOB_ID = 1000
        const val IMAGE_URI = "image_uri"
        const val IMAGE_URL = "image_url"
        const val DOCUMENT_URI = "document_uri"
        const val DOCUMENT_URL = "document_url"

        /**
         * Convenience method for enqueuing work in to this service.
         */
        fun enqueueWork(context: Context, work: Intent?) {
            enqueueWork(context,
                UploadService::class.java, JOB_ID,
                work!!)
        }
    }
}