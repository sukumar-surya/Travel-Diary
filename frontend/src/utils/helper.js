export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
    if (!name) return '';

    const words = name.split(' ');

    let initials = '';

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i].charAt(0).toUpperCase();
    }
    return initials;
}

export const getEmptyCardMessage = (filterType) => {
    switch (filterType) {
        case 'search':
            return 'No stories found for this search';
        default:
            return `Start creating your first travel story! Click the button below to get started.`
    }
}