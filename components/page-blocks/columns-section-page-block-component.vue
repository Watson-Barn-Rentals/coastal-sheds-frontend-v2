<script setup lang="ts">
import type { ColumnsSectionPageBlockData } from '~/types/page-blocks/columns-section';

const props = defineProps<{
  data: ColumnsSectionPageBlockData;
}>();

useCustomCss(props.data.pageBlockCustomStyling.css)
useCustomCss(props.data.contentAreaCustomStyling.css)

// Flatten all columns across groups (for mobile rendering)
const allColumns = computed(() =>
  (props.data.columnGroups ?? []).flatMap(g => g.columns ?? [])
);

allColumns.value.forEach(element => {
  useCustomCss(element.columnCustomStyling.css)
});

const mobileColumnSections = computed(() =>
  allColumns.value
    .flatMap(column => column.columnSections)
    .filter(section => section.mobileOrder != null)
    .sort((a, b) => Number(a.mobileOrder) - Number(b.mobileOrder))
);

// Treat `contentAreaBackgroundFilter` as a free-form value:
//   - If it’s blur()/saturate()/etc., apply backdrop-filter (and Safari prefix).
const contentAreaStyling = computed(() => {
  const bgColor = props.data.contentAreaBackgroundColor ?? 'transparent';
  const filterVal = props.data.contentAreaBackgroundFilter || '';

  const filterStyles = filterVal
    ? {
        backdropFilter: filterVal,
        WebkitBackdropFilter: filterVal, // Safari
      }
    : {};

  return {
    paddingTop: props.data.contentAreaPaddingTop,
    paddingBottom: props.data.contentAreaPaddingBottom,
    paddingLeft: props.data.contentAreaPaddingLeft,
    paddingRight: props.data.contentAreaPaddingRight,
    borderRadius: props.data.contentAreaCornerRadius,
    backgroundColor: bgColor,
    color: props.data.contentAreaTextColor || undefined,
    ...filterStyles,
  } as Record<string, string | undefined>;
});
</script>

<template>
  <PageBlockCustomBackgroundWrapper
    :background-option="props.data.pageBlockBackgroundOption"
    :background-color="props.data.pageBlockBackgroundColor"
    :background-image-url="props.data.pageBlockBackgroundImageUrl"
    :background-video-url="props.data.pageBlockBackgroundVideoUrl"
    :fade-top-and-bottom="props.data.fadeTopAndBottomOfPageBlock"
    :class="props.data.pageBlockCustomStyling.classNames.join(' ')"
    :style="{
      paddingTop: props.data.pageBlockPaddingTop,
      paddingBottom: props.data.pageBlockPaddingBottom,
      paddingLeft: props.data.pageBlockPaddingLeft,
      paddingRight: props.data.pageBlockPaddingRight
    }"
  >
    <!-- Mobile Layout (all sections flattened & ordered by mobileOrder) -->
    <div
      class="block md:hidden mx-8"
      :class="props.data.contentAreaCustomStyling.classNames.join(' ')"
      :style="contentAreaStyling"
    >
      <ColumnSectionRenderer :column-sections="mobileColumnSections" />
    </div>

    <!-- Desktop Layout: render each column group stacked vertically -->
    <div class="hidden md:block mx-8">
      <div
        class="flex flex-col mx-auto"
        :class="props.data.contentAreaCustomStyling.classNames.join(' ')"
        :style="[
          contentAreaStyling,
          {
            maxWidth: props.data.columnLayoutWidth === 'standard-max-width' ? '1200px' : '100%',
          }
        ]"
      >
        <div
          v-for="(group, groupIndex) in props.data.columnGroups"
          :key="groupIndex"
          class="flex justify-center gap-8"
        >
          <div
            v-for="(column, columnIndex) in group.columns"
            :key="`${groupIndex}-${columnIndex}`"
            :style="{
              width: `calc(${column.width} - ${((group.columns.length - 1) * 32) / group.columns.length}px)`,
            }"
            :class="column.columnCustomStyling.classNames.join(' ')"
          >
            <div>
              <ColumnSectionRenderer :column-sections="column.columnSections" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageBlockCustomBackgroundWrapper>
</template>
