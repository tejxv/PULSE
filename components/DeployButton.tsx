import Logo from '@/app/components/Logo'

export default function DeployButton() {
  return (
    <a
      className="py-2 font-semibold px-3 flex rounded-md no-underline"
      href="/"
      rel="noreferrer"
    >
      <Logo />
    </a>
  )
}
