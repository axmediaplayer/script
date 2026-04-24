(function() {
    function addVideoButton() {

        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            const videoContainer = video.closest('div[data-testid="videoPlayer"]') || video.parentElement;

            if (videoContainer && !videoContainer.classList.contains('url-btn-added')) {
                try {
                    const btn = document.createElement('button');

                    btn.style.position = 'absolute';
                    btn.style.top = '10px';
                    btn.style.right = '10px';
                    btn.style.backgroundColor = '#FF0000';
                    btn.style.border = '2px solid white';
                    btn.style.borderRadius = '50%';
                    btn.style.width = '45px';
                    btn.style.height = '45px';
                    btn.style.display = 'flex';
                    btn.style.alignItems = 'center';
                    btn.style.justifyContent = 'center';
                    btn.style.zIndex = '9999';
                    btn.style.opacity = '0.9';

                    const svgIcon = `
                        <svg viewBox="0 0 24 24" width="25" height="25" fill="white">
                            <path d="M12 2v11.586l-2.293-2.293-1.414 1.414L12 16.414l3.707-3.707-1.414-1.414L13 13.586V2h-2zM4 18v2h16v-2H4z"></path>
                        </svg>`;

                    btn.innerHTML = svgIcon;

                    btn.onclick = function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        const post = video.closest('article');
                        const linkElement = post ? post.querySelector('a[href*="/status/"]') : null;

                        if (linkElement && linkElement.href) {
                            if (window.JavaInterface) {
                                window.JavaInterface.onUrlClick(linkElement.href);
                            } else {
                                console.log("URL:", linkElement.href);
                            }
                        }
                    };

                    videoContainer.style.position = 'relative';
                    videoContainer.appendChild(btn);
                    videoContainer.classList.add('url-btn-added');
                } catch (err) {
                    console.error("Mobile Inject Error: ", err);
                }
            }
        });
    }


    setInterval(addVideoButton, 1500);

    const observer = new MutationObserver(addVideoButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();