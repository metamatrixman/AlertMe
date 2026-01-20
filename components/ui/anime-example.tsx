import anime from 'animejs';
import { useEffect } from 'react';

export function AnimeExample() {
  useEffect(() => {
    anime({
      targets: '.anime-box',
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutExpo',
    });
  }, []);

  return (
    <div className="anime-box bg-heroicons-primary text-white p-4 rounded-lg">
      Animated with Anime.js
    </div>
  );
}