export namespace TYPES {
    export type TimeBucket =
        | '24 hours'
        | '6 hours'
        | '2 hours'
        | '30 minutes'
        | '10 minutes';

    export type DB_SCHEMA = { [key: string]: { [key: string]: string[] } };

    export type DATA = { [key: string]: string | number }[];

    export type META_DATA = {
        [key: string]: {
            unit: string | null;
            description: string | null;
            minimum: number | null;
            decimal_places: number | null;
            detection_limit: number | null;
        };
    };

    export type SELECTED_SENSORS = { [key: string]: boolean };

    export type MAX_TIME = { date: number; hour: number };
}

export const CONSTANTS: {
    HEX_COLORS: string[];
    TEXT_COLORS: string[];
    TEXT_COLORS_LIGHT: string[];
    BG_COLORS: string[];
    SVG_HEIGHT: number;
    PLOT: {
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        width: number;
        height: number;
    };
    TIMES: TYPES.TimeBucket[];
    HOUR_FRACTIONS: { [key in TYPES.TimeBucket]: number };
    CIRCLE_RADII: { [key in TYPES.TimeBucket]: number };
} = {
    HEX_COLORS: [
        '#f43f5e',
        '#a855f7',
        '#3b82f6',
        '#14b8a6',
        '#84cc16',
        '#f97316',
        '#ec4899',
        '#8b5cf6',
        '#0ea5e9',
        '#10b981',
        '#eab308',
        '#ef4444',
    ],
    TEXT_COLORS: [
        'text-rose-600',
        'text-purple-600',
        'text-blue-600',
        'text-teal-600',
        'text-lime-600',
        'text-orange-600',
        'text-pink-600',
        'text-violet-600',
        'text-sky-600',
        'text-emerald-600',
        'text-yellow-600',
        'text-red-600',
    ],
    TEXT_COLORS_LIGHT: [
        'text-rose-300',
        'text-purple-300',
        'text-blue-300',
        'text-teal-300',
        'text-lime-300',
        'text-orange-300',
        'text-pink-300',
        'text-violet-300',
        'text-sky-300',
        'text-emerald-300',
        'text-yellow-300',
        'text-red-300',
    ],
    BG_COLORS: [
        'bg-rose-500',
        'bg-purple-500',
        'bg-blue-500',
        'bg-teal-500',
        'bg-lime-500',
        'bg-orange-500',
        'bg-pink-500',
        'bg-violet-500',
        'bg-sky-500',
        'bg-emerald-500',
        'bg-yellow-500',
        'bg-red-500',
    ],
    SVG_HEIGHT: 150,
    PLOT: {
        xMin: 40,
        xMax: 380,
        yMin: 5,
        yMax: 130,
        width: 400,
        height: 150,
    },
    TIMES: ['10 minutes', '30 minutes', '2 hours', '6 hours', '24 hours'],
    HOUR_FRACTIONS: {
        '10 minutes': 0.1666666,
        '30 minutes': 0.5,
        '2 hours': 2,
        '6 hours': 6,
        '24 hours': 24,
    },
    CIRCLE_RADII: {
        '10 minutes': 2,
        '30 minutes': 1.75,
        '2 hours': 1.25,
        '6 hours': 1,
        '24 hours': 0.75,
    },
};
