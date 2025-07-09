package com.poc_lab.nativeVideoControl

import android.graphics.Bitmap
import android.media.MediaMetadataRetriever
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.nativevideocontrol.NativeVideoControlModuleSpec
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream

class NativeVideoControlModule(reactContext: ReactApplicationContext) :
    NativeVideoControlModuleSpec(reactContext) {

    override fun getName() = NAME
    override fun getThumbnailList(promise: Promise?) {
        Log.d("NativeVideoControlModule", "getThumbnailList:")


        CoroutineScope(Dispatchers.IO).launch {
            val retriever = MediaMetadataRetriever()
            val results = Arguments.createArray()
            val context = reactApplicationContext

            try {
                val afd = context.assets.openFd("bigBUnny.mp4")
                retriever.setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                val cacheDir = context.cacheDir

                for (timeMs in 0 until 1000 * 180 step 1000) {
                    val timeUs = timeMs * 1000L
                    val bitmap =
                        retriever.getFrameAtTime(timeUs, MediaMetadataRetriever.OPTION_CLOSEST_SYNC)

                    if (bitmap != null) {
                        val file = File(cacheDir, "thumb_$timeMs.jpg")
                        FileOutputStream(file).use { out ->
                            bitmap.compress(Bitmap.CompressFormat.JPEG, 90, out)
                        }

                        val map = Arguments.createMap()
                        map.putInt("timeMs", timeMs)
                        map.putString("uri", file.absolutePath)
                        results.pushMap(map)
                    }
                }

                retriever.release()

                withContext(Dispatchers.Main) {
                    promise?.resolve(results)
                }

            } catch (e: Exception) {
                Log.e("NativeVideoControlModule", "Exception in getThumbnailList", e)
                retriever.release()
                withContext(Dispatchers.Main) {
                    promise?.reject("THUMBNAIL_ERROR", e.message)
                }
            }
        }

    }


    companion object {
        const val NAME = "NativeVideoControl"
    }
}
