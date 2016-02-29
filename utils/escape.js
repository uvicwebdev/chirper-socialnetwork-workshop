function escapeHtml(text) {
    'use strict';
    return text.replace(/[\"&<>]/g, '');
}

module.exports = escapeHtml;