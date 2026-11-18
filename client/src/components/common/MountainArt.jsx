// Original, decorative ridge-line illustration used where no photo exists.
function MountainArt({ className = '', withSun = false }) {
  return (
    <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      {withSun && <circle cx="1080" cy="120" r="54" fill="#D6AD60" opacity="0.85" />}
      <path
        d="M0 260 L120 190 L210 230 L330 120 L420 180 L520 90 L600 150 L700 60 L790 140 L880 100 L980 170 L1080 80 L1180 160 L1290 110 L1440 200 L1440 400 L0 400 Z"
        fill="#F8F6F0"
        opacity="0.18"
      />
      <path d="M700 60 L730 88 L715 86 L700 100 L688 86 L672 90 Z" fill="#F8F6F0" opacity="0.5" />
      <path d="M1080 80 L1108 106 L1094 104 L1080 118 L1068 104 L1052 108 Z" fill="#F8F6F0" opacity="0.5" />
      <path
        d="M0 300 L150 240 L260 280 L400 200 L520 260 L640 210 L760 270 L900 190 L1030 250 L1160 210 L1300 260 L1440 230 L1440 400 L0 400 Z"
        fill="#28745A"
        opacity="0.55"
      />
      <path
        d="M0 340 L180 300 L330 330 L480 290 L640 330 L820 300 L980 335 L1140 305 L1300 330 L1440 310 L1440 400 L0 400 Z"
        fill="#164B3B"
        opacity="0.9"
      />
    </svg>
  )
}

export default MountainArt
