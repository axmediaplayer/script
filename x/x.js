(function() {
    function addVideoButton() {
        const videoContainers = document.querySelectorAll('div[data-testid="videoPlayer"]:not(.url-btn-added)');

        videoContainers.forEach(videoDiv => {
            try {
                const btn = document.createElement('button');
                btn.setAttribute('title', 'Get Video URL');
                
                btn.style.position = 'absolute';
                btn.style.top = '15px';
                btn.style.right = '15px';
                btn.style.backgroundColor = '#FF0000';
                btn.style.border = '2px solid white';
                btn.style.borderRadius = '50%';
                btn.style.width = '50px';
                btn.style.height = '50px';
                btn.style.display = 'flex';
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
                btn.style.cursor = 'pointer';
                btn.style.zIndex = '1000';
                btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
                const svgIcon = `
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
                        <path d="M12 2C11.4477 2 11 2.44772 11 3V13.5858L8.70711 11.2929C8.31658 10.9024 7.68342 10.9024 7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L16.7071 12.7071C17.0976 12.3166 17.0976 11.6834 16.7071 11.2929C16.3166 10.9024 15.6834 10.9024 15.2929 11.2929L13 13.5858V3C13 2.44772 12.5523 2 12 2Z"></path>
                        <path d="M4 18C3.44772 18 3 18.4477 3 19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19C21 18.4477 20.5523 18 20 18H4Z"></path>
                    </svg>`;
                
                btn.innerHTML = svgIcon;

                btn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const post = videoDiv.closest('article');
                    const linkElement = post ? post.querySelector('time')?.parentElement : null;
                    
                    if (linkElement && linkElement.href) {

                       JavaInterface.onUrlClick(linkElement.href);

                    }
                };

                videoDiv.parentElement.style.position = 'relative'; 
                videoDiv.appendChild(btn);
                videoDiv.classList.add('url-btn-added');
            } catch (err) {
                console.error("Design error: ", err);
            }
        });
    }

    const observer = new MutationObserver(() => {
        addVideoButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    addVideoButton();
})();