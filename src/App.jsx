import { useState, useCallback } from 'react'
import { removeBackground } from '@imgly/background-removal'
import { ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid'

function App() {
  const [image, setImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      processImage(file)
    }
  }, [])

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      processImage(file)
    }
  }, [])

  const processImage = async (file) => {
    try {
      setLoading(true)
      setError(null)
      setImage(URL.createObjectURL(file))
      setProcessedImage(null)

      const result = await removeBackground(file)
      setProcessedImage(URL.createObjectURL(result))
    } catch (err) {
      setError('Failed to process image. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = processedImage
    link.download = 'processed-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Cool Background Remover</h1>
        
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="fileInput"
          />
          <label 
            htmlFor="fileInput" 
            className="cursor-pointer flex flex-col items-center"
          >
            <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg mb-2">Drag and drop an image here, or click to select</p>
            <p className="text-sm text-gray-500">Supports JPG, PNG, WebP</p>
          </label>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2">Processing image...</p>
          </div>
        )}

        {(image || processedImage) && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {image && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Original Image</h2>
                <img 
                  src={image} 
                  alt="Original" 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            )}
            {processedImage && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">Processed Image</h2>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    Download
                  </button>
                </div>
                <img 
                  src={processedImage} 
                  alt="Processed"
                  className="w-full rounded-lg shadow-lg bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABMSURBVDiNY/z//z8DJYCJgUIw8AawIHN8Gxf9x6UGXd1AuxDdBf/R+MguYSHFAGQXwMB/LJK4XEKRFxixhAE6H5caBrK8MGoAlQAAn0EH/y8mSYkAAAAASUVORK5CYII=')]"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
