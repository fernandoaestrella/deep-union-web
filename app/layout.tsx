import './globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
  metadataBase: new URL('https://postgres-prisma.vercel.app'),
  title: 'deep union web',
  description:
    'a web tool to request and offer help from nearby strangers in a structured manner',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <header className="bg-slate-800 px-6 py-4 text-white">
          <h1 className="text-2xl font-bold">deep union web</h1>
          <p className="mt-2 text-sm">a web tool to request and offer help from nearby strangers in a structured manner</p>
        </header>
        {children}
        <footer>
          <div className='text-center'>
            More experiments <a className='text-slate-400' href="https://github.com/fernandoaestrella">here</a>
          </div>
        </footer>
      </body>
    </html>
  )
}

