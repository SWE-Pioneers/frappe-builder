<template>
	<StylePropertyControl
		:component="Autocomplete"
		:propertyKey="property"
		:label="label"
		:enableSlider="true"
		:options="[
			{
				label: __('Auto'),
				value: 'auto',
			},
			{
				label: __('Fit Content'),
				value: 'fit-content',
			},
			{
				label: __('Stretch'),
				value: '100%',
			},
		]"
		:unitOptions="['px', '%', 'vw', 'vh']"></StylePropertyControl>
</template>
<script setup lang="ts">
import Autocomplete from "@/components/Controls/Autocomplete.vue";
import StylePropertyControl from "@/components/Controls/StylePropertyControl.vue";

defineProps<{
	property: styleProperty;
	label: string;
}>();
</script>
