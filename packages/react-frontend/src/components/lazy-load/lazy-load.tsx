import React, { useEffect, useState } from 'react';
import { useLazyLoadStyles } from "./lazy-load.style";


const placeHolder =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII='

export const LazyImage: React.FC<{ src: any; alt: any; }> = ({ src, alt }) => {
    const classes = useLazyLoadStyles();
    const [imageSrc, setImageSrc] = useState(placeHolder)
    const [imageRef, setImageRef] = useState()

    useEffect(() => {
        let observer: any;
        let didCancel = false

        if (imageRef && imageSrc === placeHolder) {
            if (IntersectionObserver) {
                observer = new IntersectionObserver(
                    entries => {
                        entries.forEach(entry => {
                            if (
                                !didCancel &&
                                (entry.intersectionRatio > 0 || entry.isIntersecting)
                            ) {
                                setImageSrc(src)
                            }
                        })
                    },
                    {
                        threshold: 0.01,
                        rootMargin: '75%',
                    }
                )
                observer.observe(imageRef)
            } else {
                // Old browsers fallback
                setImageSrc(src)
            }
        }
        return () => {
            didCancel = true
            // on component unmount, we remove the listner
            if (observer && observer.unobserve) {
                observer.unobserve(imageRef)
            }
        }
    }, [imageRef, imageSrc, src])

    return <img className={classes.defaultImage} ref={setImageRef as any} src={imageSrc} alt={alt} />
}