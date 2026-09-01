export function shouldShowAppFooter(pathname: string | null) {
  return (
    pathname === null ||
    !(pathname === "/play" || pathname.startsWith("/play/"))
  );
}
