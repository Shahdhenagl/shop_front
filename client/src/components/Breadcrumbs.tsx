// Style: SAFETY ENG — مسار تنقل RTL هادئ يوضح مكان المستخدم دون منافسة محتوى الصفحة.
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="مسار التنقل" dir="rtl">
      <Link href="/">الرئيسية</Link>
      {items.map((item, index) => (
        <span className="breadcrumbs-segment" key={`${item.label}-${index}`}>
          <ChevronLeft size={14} aria-hidden="true" />
          {item.href && index !== items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
