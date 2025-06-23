<script lang="ts" setup>

defineProps<{
  borderWidthInPx: number;
  borderRadiusFactor?: number;
  defaultBorderColor: string;
  glowColor: string;
}>();

const cardRef = ref<HTMLElement | null>(null);

const handleMouseMove = (event: MouseEvent) => {
  if (!cardRef.value) return;

  const rect = cardRef.value.getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;

const maxDistanceOutside = 100

let opacity;
if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
    opacity = 1;
} else {
    const clampedX = Math.max(rect.left, Math.min(x, rect.right));
    const clampedY = Math.max(rect.top, Math.min(y, rect.bottom));
    const distance = Math.sqrt((x-clampedX) ** 2 + (y-clampedY) ** 2);
    opacity = Math.max(0, 1 - distance / maxDistanceOutside);
}

  // Update the CSS variables for dynamic glow effect
  cardRef.value.style.setProperty("--glow-x", `${x - rect.left}px`);
  cardRef.value.style.setProperty("--glow-y", `${y - rect.top}px`);
  cardRef.value.style.setProperty("--glow-opacity", opacity.toString());
};

const handleMouseLeave = () => {

};

// Add event listeners on mount
onMounted(() => {
  if (cardRef.value) {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
  }
});

// Remove event listeners when unmounted
onUnmounted(() => {
  if (cardRef.value) {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseleave", handleMouseLeave);
  }
});
</script>

<template>
  <div
    ref="cardRef"
    class="card"
    :style="{
      '--border-width-in-px': `${borderWidthInPx}px`,
      '--default-border-color': defaultBorderColor,
      '--glow-color': glowColor,
      '--border-radius-factor': borderRadiusFactor ? `${borderRadiusFactor}` : '1',
    }"
  >
    <div class="inner">
      <slot />
    </div>
    <div class="glow"></div>
  </div>
</template>

<style scoped>
/* Card container */
.card {
  position: relative;
  border-radius: calc(var(--border-width-in-px) * var(--border-radius-factor) + var(--border-width-in-px));
  background-color: var(--default-border-color);
  overflow: hidden;
}

/* Inner content */
.inner {
  border-radius: calc(var(--border-width-in-px) * var(--border-radius-factor));
  width: calc(100% - var(--border-width-in-px) * 2);
  height: calc(100% - var(--border-width-in-px) * 2);
  margin: var(--border-width-in-px);
  /* backdrop-filter: blur(20px); */
  overflow: hidden;
}

/* Glow effect following the cursor */
.glow {
  position: absolute;
  top: var(--glow-y);
  left: var(--glow-x);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--glow-color) 50%, transparent 60%);
  transform: translate(-50%, -50%);
  opacity: var(--glow-opacity, 0);
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(25px);
  mix-blend-mode: screen;
}
</style>
