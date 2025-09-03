import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const visiblePages = 5; // 중앙에 표시될 페이지 번호 수

        if (totalPages <= visiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
        } else {
            pageNumbers.push(1);
            let start = Math.max(2, currentPage - Math.floor((visiblePages - 2) / 2));
            let end = Math.min(totalPages - 1, currentPage + Math.floor(visiblePages / 2));

            if (currentPage < visiblePages - 1) {
                end = visiblePages;
            }
            if (currentPage > totalPages - (visiblePages - 2)) {
                start = totalPages - visiblePages + 1;
            }

            if (start > 2) pageNumbers.push('...');
            for (let i = start; i <= end; i++) pageNumbers.push(i);
            if (end < totalPages - 1) pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };

    const createPageUrl = (page: number) => {
        const separator = basePath.includes('?') ? '&' : '?';
        return `${basePath}${separator}page=${page}`;
    };

    const pageNumbers = getPageNumbers();
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;

    return (
        <nav aria-label="Page navigation" className="mt-12 flex items-center justify-center gap-2">
            <Link
                href={hasPrev ? createPageUrl(currentPage - 1) : '#'}
                aria-disabled={!hasPrev}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-white bg-white/10 transition-colors hover:bg-white/20 ${!hasPrev && 'pointer-events-none opacity-50'}`}>
                <ArrowLeft size={16} />
            </Link>

            <div className="flex items-center gap-2">
                {pageNumbers.map((page, index) =>
                    typeof page === 'number' ? (
                        <Link
                            key={page}
                            href={createPageUrl(page)}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg font-semibold transition-colors ${
                                currentPage === page
                                    ? 'bg-white text-gray-900'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                            }`}>
                            {page}
                        </Link>
                    ) : (
                        <span key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center text-white/50">
                            {page}
                        </span>
                    )
                )}
            </div>

            <Link
                href={hasNext ? createPageUrl(currentPage + 1) : '#'}
                aria-disabled={!hasNext}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-white bg-white/10 transition-colors hover:bg-white/20 ${!hasNext && 'pointer-events-none opacity-50'}`}>
                <ArrowRight size={16} />
            </Link>
        </nav>
    );
}
