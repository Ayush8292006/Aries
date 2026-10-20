import Container from '../ui/Container'

export default function AnnouncementBar() {
  return (
    <div className="bg-emerald-deep">
      <Container className="flex h-9 items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.2em] text-gold-light">
        <span>Complimentary shipping on qualifying orders</span>
        <span className="hidden h-1 w-1 rounded-full bg-gold sm:block" />
        <span className="hidden sm:block">Handcrafted since 1992</span>
      </Container>
    </div>
  )
}