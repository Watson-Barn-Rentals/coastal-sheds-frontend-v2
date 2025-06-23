<template>
    <section class="relative h-[35rem]">
        <div class="absolute inset-0 z-0">
            <div class="relative h-[75%]">
                <div
                    class="absolute inset-0 bg-blue-900"
                    style="clip-path: url(#gradiant2Clip);"
                ></div>
                <div
                    class="absolute inset-0"
                    style="background: linear-gradient(to left, orange, gold); clip-path: url(#gradiantClip);"
                ></div>
                <div
                    class="absolute inset-0"
                    style="clip-path: url(#heroClip);"
                >
                <div 
                    class="w-full h-full"
                    :style="{
                        backgroundImage: `url(${data.images['main-hero']})`,
                        backgroundSize: 'cover',
                        backgroundPosition: '50% 26%',
                        backgroundRepeat: 'no-repeat',
                    }"
                />
                </div>
                <div
                    class="absolute left-0 top-0 sm:top-auto sm:bottom-8 w-full sm:w-1/2 sm:mt-0 m-4 sm:m-8 text-start">
                    <slot name="title" />
                </div>
            </div>
        </div>
        <div
            class="absolute right-0 top-[20%] w-1/2 h-[95%] sm:h-[90%] flex flex-col justify-center pr-4 sm:px-8">
            <div class="w-full max-w-[30rem] max-h-full mx-auto flex sm:justify-center">
                <Logo class="small-white-glow" />
                <!-- <img src="./../assets/logo.svg" alt="Building Cutout" class="max-w-full max-h-full glow"> -->
            </div>
        </div>
        <div class="absolute left-0 top-[75%] h-[25%] w-full sm:w-1/2 flex flex-col justify-end">
            <div class="p-4 pt-16 sm:p-8 h-full">
                <slot name="cta" />
            </div>
        </div>
    </section>

    <svg class="absolute w-0 h-0">
        <defs>
            <clipPath
                id="gradiant2Clip"
                clipPathUnits="objectBoundingBox"
            >
                <path d="M0 0 1 0V.96Q.8.81.46.91.14 1.01 0 .99Z" />
            </clipPath>
        </defs>
    </svg>
    <svg class="absolute w-0 h-0">
        <defs>
            <clipPath
                id="gradiantClip"
                clipPathUnits="objectBoundingBox"
            >
                <path d="M0 0 1 0V.94Q.8.81.458.907.14 1.01 0 .97Z" />
            </clipPath>
        </defs>
    </svg>
    <svg class="absolute w-0 h-0">
        <defs>
            <clipPath
                id="heroClip"
                clipPathUnits="objectBoundingBox"
            >
                <path d="M0 0 1 0V.88Q.8.81.46.9.14 1.01 0 .92Z" />
            </clipPath>
        </defs>
    </svg>
</template>