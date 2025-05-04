import Image from 'next/image'
import logo from '@/public/logo/pico.svg'

export default function DeployButton() {
  return (
    <a
      className="py-2 font-semibold px-3 flex rounded-md no-underline"
      href="/"
      rel="noreferrer"
    >
    <Image
      src={logo}
      alt="PICO Logo"
      width={120}
      height={32}
      className="rounded-lg"
    />
    </a>
  )
}
