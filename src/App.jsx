import { useEffect, useRef, useState } from 'react'
import Mainpage from './components/Mainpage'
function App() {
  const [image, setImage] = useState(null)
  const currentRef = useRef(null)

  const handleImageData = (e) => {
    const file = e.target.files[0]
    if (file) {
      const readimage = new FileReader()
      readimage.readAsDataURL(file)
      readimage.onload = () => {
        setImage(readimage.result)
      }
    }
  }

  useEffect(() => {
    if (image) {
      const canvas = currentRef.current
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const canvasImg = new Image()
      canvasImg.src = image
      canvasImg.onload = () => {
        const imageRatio = canvasImg.width / canvasImg.height
        const canvasRatio = canvas.width / canvas.height

        let scaledWidth, scaledHeight, offsetX, offsetY

        // Scale the image to fit the canvas
        if (imageRatio > canvasRatio) {
          scaledWidth = canvas.width;
          scaledHeight = canvas.width / imageRatio;
        } else {
          scaledHeight = canvas.height
          scaledWidth = canvas.height * imageRatio
        }

        offsetX = (canvas.width - scaledWidth) / 2
        offsetY = (canvas.height - scaledHeight) / 2

        ctx.drawImage(
          canvasImg,
          offsetX,
          offsetY,
          scaledWidth,
          scaledHeight
        )
      }
    }
  }, [image]);

  return (
    <>
    <Mainpage/>
       
    </>
  );
}

export default App;
