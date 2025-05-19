import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Okamžité nastavení mobilního stavu
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Handler pro změnu velikosti okna
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Přidání event listeneru na změnu velikosti okna
    window.addEventListener('resize', handleResize)
    
    // Čistící funkce
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}

// Oba exportované hooky jsou identické
export { useIsMobile as useMobile }
