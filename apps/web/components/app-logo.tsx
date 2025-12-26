import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@kit/ui/utils';

import bloggerrLogo from './bloggerr-logo.png';

function LogoImage({
  className,
  width = 105,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  // Calculate height proportionally if not provided (assuming square-ish logo)
  const logoHeight = height ?? width;

  return (
    <Image
      src={bloggerrLogo}
      alt="Bloggerr"
      width={width}
      height={logoHeight}
      className={cn('object-contain', className)}
      priority
    />
  );
}

export function AppLogo({
  href,
  label,
  className,
}: {
  href?: string | null;
  className?: string;
  label?: string;
}) {
  if (href === null) {
    return <LogoImage className={className} />;
  }

  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'}>
      <LogoImage className={className} />
    </Link>
  );
}
