import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { dangNhapApi, dangKyApi, dangNhapOAuthApi } from '../services/xacThucService'
import { api } from '../services/api'
import type { NguoiDung } from '../types'
import { XacThucContext } from './xacThucContext'

const KHOA = 'qlct-nguoi-dung'

function docNguoiDung(): NguoiDung | null {
  if (!localStorage.getItem('qlct-token')) return null
  try {
    return JSON.parse(localStorage.getItem(KHOA) ?? 'null') as NguoiDung | null
  } catch {
    return null
  }
}

export function XacThucProvider({ children }: { children: ReactNode }) {
  const [nguoiDung, setNguoiDung] = useState<NguoiDung | null>(docNguoiDung)
  const daDongBoEmail = useRef<string | null>(null)

  const datNguoiDung = useCallback((nd: NguoiDung | null) => {
    setNguoiDung(nd)
    if (nd) localStorage.setItem(KHOA, JSON.stringify(nd))
    else localStorage.removeItem(KHOA)
  }, [])

  useEffect(() => {
    const hetPhien = () => datNguoiDung(null)
    window.addEventListener('finora:unauthorized', hetPhien)
    return () => window.removeEventListener('finora:unauthorized', hetPhien)
  }, [datNguoiDung])

  const emailHienTai = nguoiDung?.email
  useEffect(() => {
    const token = localStorage.getItem('qlct-token')
    if (!emailHienTai || !token) {
      daDongBoEmail.current = null
      return
    }
    if (daDongBoEmail.current === emailHienTai) return
    let conHieuLuc = true
    api.get<NguoiDung>('/api/nguoi-dung/ho-so')
      .then(({ data }) => {
        if (!conHieuLuc) return
        daDongBoEmail.current = emailHienTai
        setNguoiDung((cu) => {
          if (cu && cu.ten === data.ten && cu.email === data.email && cu.anhDaiDien === data.anhDaiDien && cu.ngaySinh === data.ngaySinh) {
            return cu
          }
          localStorage.setItem(KHOA, JSON.stringify(data))
          return data
        })
      })
      .catch((error: unknown) => {
        const loi = error as { response?: { status?: number } }
        if (conHieuLuc && loi.response?.status === 401) datNguoiDung(null)
      })
    return () => { conHieuLuc = false }
  }, [emailHienTai, datNguoiDung])

  const capNhatHoSo = useCallback(async (nd: NguoiDung) => {
    const { data } = await api.put<NguoiDung>('/api/nguoi-dung/ho-so', nd)
    datNguoiDung(data)
  }, [datNguoiDung])

  const value = useMemo(
    () => ({
      nguoiDung,
      dangNhap: async (email: string, matKhau: string) => datNguoiDung(await dangNhapApi(email, matKhau)),
      dangNhapOAuth: async (provider: 'google' | 'facebook', token: string) =>
        datNguoiDung(await dangNhapOAuthApi(provider, token)),
      dangKy: async (ten: string, email: string, matKhau: string) => datNguoiDung(await dangKyApi(ten, email, matKhau)),
      capNhatHoSo,
      dangXuat: () => {
        localStorage.removeItem('qlct-token')
        datNguoiDung(null)
      },
    }),
    [nguoiDung, datNguoiDung, capNhatHoSo],
  )
  return <XacThucContext.Provider value={value}>{children}</XacThucContext.Provider>
}
