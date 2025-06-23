import mitt from 'mitt';
import type { AvailableSubHeaders } from '~/types/available-sub-headers';

type ApplicationEvents = {
    // 
};

const emitter = mitt<ApplicationEvents>()

export const useEvent = emitter.emit
export const useListen = emitter.on