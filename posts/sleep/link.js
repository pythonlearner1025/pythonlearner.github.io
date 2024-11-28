document.addEventListener('DOMContentLoaded', function() {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'citation-tooltip';
    document.body.appendChild(tooltip);

    let tooltipTimeout = null;

    // Get all citation references from References section
    const citations = {};
    const referencesSection = document.querySelector('.references ol');
    if (referencesSection) {
        referencesSection.querySelectorAll('li').forEach((ref, index) => {
            const link = ref.querySelector('a');
            citations[index + 1] = link ? link.href : null;
        });
    }

    // CSS
    const style = document.createElement('style');
    style.textContent = `
        .citation-link {
            color: #0645ad;
            text-decoration: none;
            cursor: pointer;
        }
        .citation-link:hover {
            text-decoration: underline;
        }
        .citation-tooltip {
            position: fixed;
            background: white;
            border: 1px solid #ccc;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: none;
            z-index: 1000;
            white-space: nowrap;
            font-family: monospace;
        }
        .citation-tooltip a {
            color: #0645ad;
            text-decoration: none;
        }
        .citation-tooltip a:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);

   // Inside the showTooltip function, replace the positioning code with:
    function showTooltip(target) {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => {
        const href = target.href;
        if (href) {
            const link = document.createElement('a');
            link.href = href;
            link.textContent = href;
            tooltip.innerHTML = '';
            tooltip.appendChild(link);
            tooltip.style.display = 'block';

            // Position tooltip
            const rect = target.getBoundingClientRect();
            const screenMidpoint = window.innerWidth / 2;
            const citationMidpoint = rect.left + (rect.width / 2);

            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;

            // If citation is in right half of screen, align tooltip's right edge with citation
            if (citationMidpoint > screenMidpoint) {
                const rightEdge = rect.right;
                tooltip.style.right = `${window.innerWidth - rightEdge}px`;
                tooltip.style.left = 'auto';
            } 
            // If citation is in left half of screen, align tooltip's left edge with citation
            else {
                tooltip.style.left = `${rect.left}px`;
                tooltip.style.right = 'auto';
            }
        }
    }, 500);
}
    function hideTooltip() {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            tooltip.style.display = 'none';
        }, 500);
    }

    // Find and wrap citation brackets with links
    function wrapCitations() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.parentElement.closest('.references') || 
                        node.parentElement.classList.contains('citation-link')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        nodes.forEach(textNode => {
            const text = textNode.textContent;
            if (text.match(/\[\d+\]/)) {
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                text.replace(/\[(\d+)\]/g, (match, num, offset) => {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, offset)));

                    const link = document.createElement('a');
                    link.className = 'citation-link';
                    link.textContent = match;
                    
                    if (citations[num]) {
                        link.href = citations[num];
                        link.title = `Citation ${num}`;
                    }

                    fragment.appendChild(link);
                    lastIndex = offset + match.length;
                });

                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }

    // Event handlers
    tooltip.addEventListener('mouseenter', () => {
        clearTimeout(tooltipTimeout);
    });

    tooltip.addEventListener('mouseleave', () => {
        hideTooltip();
    });

    document.addEventListener('mouseover', function(e) {
        if (e.target.classList.contains('citation-link')) {
            showTooltip(e.target);
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.classList.contains('citation-link')) {
            hideTooltip();
        }
    });

    // Initialize
    wrapCitations();
});