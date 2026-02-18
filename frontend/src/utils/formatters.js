import { formatDistanceToNow, format } from 'date-fns';

export const formatDate = (timestamp) => {
    try {
        const date = new Date(timestamp);
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
        return 'Unknown date';
    }
};

export const formatFullDate = (timestamp) => {
    try {
        const date = new Date(timestamp);
        return format(date, 'MMMM dd, yyyy');
    } catch (error) {
        return 'Unknown date';
    }
};

export const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

export const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
