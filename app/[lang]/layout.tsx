import '../globals.css'
import type { Locale } from '@/lib/i18n/types'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { I18nProvider } from '@/lib/i18n/client'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }, { lang: 'zh' }, { lang: 'hi' }];
}

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  
  return {
    metadataBase: new URL('https://postgres-prisma.vercel.app'),
    title: dict.app.title as string,
    description: dict.app.description as string,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  const dict = await getDictionary(params.lang);
  
  return (
    <html lang={params.lang}>
      <body className="font-sans">
        <I18nProvider dictionary={dict}>
          <header className="bg-slate-800 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{dict.app.title as string}</h1>
                <p className="mt-2 text-sm">{dict.app.description as string}</p>
              </div>
              <LanguageSwitcher currentLang={params.lang} />
            </div>
          </header>
          {children}
          <footer>
            <div className='text-center'>
              {dict.footer.experiments as string} <a className='text-blue-500' href="https://github.com/fernandoaestrella">here</a>
            </div>
            <div className='text-center'>
              {dict.footer.tip as string} <a className='text-blue-500' href="https://ko-fi.com/arthurstarlake">{dict.footer.tipLink as string}</a> {dict.footer.tipPlatform as string}
            </div>
          </footer>
        </I18nProvider>
      </body>
    </html>
  )
}


