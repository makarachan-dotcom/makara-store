import ClientProviders from '@/components/providers/ClientProviders'

// Layout សម្រាប់ផ្នែក Store (ទំព័រសាធារណៈ)
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientProviders>{children}</ClientProviders>
}
