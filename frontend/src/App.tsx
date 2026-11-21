import { BrowserRouter } from 'react-router-dom'
import { DuLieuProvider } from './contexts/DuLieuProvider'
import { GiaoDienProvider } from './contexts/GiaoDienProvider'
import { XacThucProvider } from './contexts/XacThucProvider'
import { DuongDan } from './routes/DuongDan'
import { ThoatUngDung } from './components/he-thong/ThoatUngDung'

export default function App() {
  return (
    <GiaoDienProvider>
      <XacThucProvider>
        <DuLieuProvider>
          <BrowserRouter>
            <DuongDan />
            <ThoatUngDung />
          </BrowserRouter>
        </DuLieuProvider>
      </XacThucProvider>
    </GiaoDienProvider>
  )
}
