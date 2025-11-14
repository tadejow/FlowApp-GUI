
import { ObjectType, ObjectCategory, GamePhase } from './types';
import type { ReactNode } from 'react';
import { SVG_STRINGS } from './assets/svgs';

export const GAME_WIDTH = 420;
export const GAME_HEIGHT = 840;

export const GAME_CONFIG = {
    RIVER_HEALTH_MAX: 100,
    RIVER_HEALTH_PENALTY_ORGANISM: 10,
    TRASH_MISS_PENALTY_DIVISOR: 2,
    BIOREMEDIATION_HEALTH_GAIN: 25,
    COMBO_HEALTH_GAIN: 5,
    COMBO_HEALTH_GAIN_THRESHOLD: 15,
    MULTIPLIER_THRESHOLDS: [
        { combo: 5, multiplier: 2 },
        { combo: 10, multiplier: 3 },
        { combo: 20, multiplier: 4 },
        { combo: 30, multiplier: 5 },
    ],
};

export const OBJECT_CONFIG: Record<ObjectType, { category: ObjectCategory; points: number; size: { w: number, h: number }; maxHealth?: number; }> = {
    [ObjectType.Bottle]: { category: ObjectCategory.Trash, points: 10, size: { w: 35, h: 80 } },
    [ObjectType.Can]: { category: ObjectCategory.Trash, points: 12, size: { w: 35, h: 50 } },
    [ObjectType.Bag]: { category: ObjectCategory.Trash, points: 8, size: { w: 60, h: 60 } },
    [ObjectType.OilSpill]: { category: ObjectCategory.Trash, points: 25, size: { w: 80, h: 80 }, maxHealth: 2 },
    [ObjectType.Barrel]: { category: ObjectCategory.Trash, points: 35, size: { w: 50, h: 70 }, maxHealth: 1 },
    [ObjectType.Microplastic]: { category: ObjectCategory.Trash, points: 20, size: { w: 60, h: 60 } },
    [ObjectType.Fish]: { category: ObjectCategory.Organism, points: -8, size: { w: 70, h: 40 } },
    [ObjectType.Spawn]: { category: ObjectCategory.Organism, points: -12, size: { w: 40, h: 40 } },
    [ObjectType.Plant]: { category: ObjectCategory.Organism, points: -6, size: { w: 50, h: 50 } },
    [ObjectType.Frog]: { category: ObjectCategory.Organism, points: -10, size: { w: 40, h: 40 } },
    [ObjectType.Leaf]: { category: ObjectCategory.Neutral, points: 0, size: { w: 40, h: 40 } },
    [ObjectType.Branch]: { category: ObjectCategory.Neutral, points: 0, size: { w: 20, h: 90 } },
};

// --- Embedded SVG Graphics ---
// This approach is more robust as it doesn't rely on a correctly configured dev server
// to serve static assets. The SVGs are bundled with the code.
// To edit, modify the strings in `assets/svgs.ts`.
const createDataUrl = (svgString: string) => `data:image/svg+xml;base64,${btoa(svgString.trim())}`;

export const OBJECT_GRAPHICS_URLS: Record<ObjectType, string> = Object.fromEntries(
    Object.entries(SVG_STRINGS).map(([key, svg]) => [key, createDataUrl(svg)])
) as Record<ObjectType, string>;


interface PhaseConfigData {
    duration: number;
    startSpeed?: number;
    endSpeed?: number;
    startSpawn?: number;
    endSpawn?: number;
    mix?: { [key in ObjectCategory]: number };
    scoreMultiplier?: number;
    speedBonus?: number;
    spawnMultiplier?: number;
    speedIncrease?: number;
    spawnIncrease?: number;
}

export const PHASE_CONFIG: Record<GamePhase, PhaseConfigData> = {
    [GamePhase.Countdown]: { duration: 3 },
    [GamePhase.Learning]: { duration: 17, startSpeed: 90, endSpeed: 90, startSpawn: 0.7, endSpawn: 1.0, mix: { [ObjectCategory.Trash]: 0.8, [ObjectCategory.Organism]: 0.15, [ObjectCategory.Neutral]: 0.05 }, scoreMultiplier: 1.0 },
    [GamePhase.RampUp]: { duration: 25, startSpeed: 90, endSpeed: 120, startSpawn: 1.0, endSpawn: 1.7, mix: { [ObjectCategory.Trash]: 0.65, [ObjectCategory.Organism]: 0.25, [ObjectCategory.Neutral]: 0.10 }, scoreMultiplier: 1.0 },
    [GamePhase.Flood]: { duration: 15, speedBonus: 20, spawnMultiplier: 2, mix: { [ObjectCategory.Trash]: 0.55, [ObjectCategory.Organism]: 0.35, [ObjectCategory.Neutral]: 0.10 }, scoreMultiplier: 1.5 },
    [GamePhase.NormalLoop]: { duration: 45, speedIncrease: 30, spawnIncrease: 0.7, mix: { [ObjectCategory.Trash]: 0.65, [ObjectCategory.Organism]: 0.25, [ObjectCategory.Neutral]: 0.10 }, scoreMultiplier: 1.0 },
};

export const EASY_TRASH = [ObjectType.Bottle, ObjectType.Can, ObjectType.Bag];
export const HARD_TRASH = [ObjectType.OilSpill, ObjectType.Barrel, ObjectType.Microplastic];
export const EASY_ORGANISMS = [ObjectType.Fish, ObjectType.Plant];
export const HARD_ORGANISMS = [ObjectType.Spawn, ObjectType.Frog];


export const EDUCATIONAL_FACTS: Record<string, { title: string, content: string }[]> = {
    en: [
        { title: "Plastic Pollution", content: "Over 8 million tons of plastic enter the oceans each year. It's like dumping a garbage truck of plastic every minute." },
        { title: "Water Cycle", content: "The water you drink today is the same water that dinosaurs drank. Earth's water is constantly recycled." },
        { title: "Microplastics", content: "Microplastics are tiny plastic particles that are harmful to marine life. They often come from larger plastic debris and cosmetics." },
        { title: "Oil Spills", content: "Oil spills block sunlight and oxygen from entering the water, which can be devastating for aquatic plants and animals." },
        { title: "River Ecosystems", content: "Healthy rivers are vital for biodiversity, providing homes for countless species of fish, insects, and plants." },
        { title: "Chemical Runoff", content: "Pesticides and chemicals from farms and cities can wash into rivers, poisoning the water and harming wildlife." }
    ],
    pl: [
        { title: "Zanieczyszczenie plastikiem", content: "Każdego roku do oceanów trafia ponad 8 milionów ton plastiku. To tak, jakby co minutę wrzucać do wody całą śmieciarkę." },
        { title: "Obieg wody", content: "Woda, którą pijesz dzisiaj, to ta sama woda, którą piły dinozaury. Woda na Ziemi jest w ciągłym obiegu." },
        { title: "Mikroplastik", content: "Mikroplastik to małe cząsteczki plastiku szkodliwe dla organizmów wodnych. Powstają z większych odpadów i kosmetyków." },
        { title: "Wycieki oleju", content: "Plamy oleju blokują dostęp światła i tlenu do wody, co jest katastrofalne dla roślin i zwierząt wodnych." },
        { title: "Ekosystemy rzeczne", content: "Zdrowe rzeki są kluczowe dla bioróżnorodności, stanowiąc dom dla niezliczonych gatunków ryb, owadów i roślin." },
        { title: "Spływy chemiczne", content: "Pestycydy i chemikalia z pól uprawnych i miast mogą spływać do rzek, zatruwając wodę i szkodząc dzikiej przyrodzie." }
    ],
    de: [
        { title: "Plastikverschmutzung", content: "Über 8 Millionen Tonnen Plastik gelangen jedes Jahr in die Ozeane. Das ist, als würde man jede Minute einen Müllwagen voller Plastik entleeren." },
        { title: "Wasserkreislauf", content: "Das Wasser, das Sie heute trinken, ist dasselbe Wasser, das die Dinosaurier getrunken haben. Das Wasser der Erde wird ständig recycelt." },
        { title: "Mikroplastik", content: "Mikroplastik sind winzige Kunststoffpartikel, die für Meereslebewesen schädlich sind. Sie stammen oft von größerem Plastikmüll und Kosmetika." },
        { title: "Ölverschmutzungen", content: "Ölteppiche blockieren Sonnenlicht und Sauerstoff daran, ins Wasser zu gelangen, was für Wasserpflanzen und -tiere verheerend sein kann." },
        { title: "Flussökosysteme", content: "Gesunde Flüsse sind für die biologische Vielfalt von entscheidender Bedeutung und bieten unzähligen Arten von Fischen, Insekten und Pflanzen ein Zuhause." },
        { title: "Chemische Abflüsse", content: "Pestizide und Chemikalien aus der Landwirtschaft und Städten können in Flüsse gespült werden, das Wasser vergiften und die Tierwelt schädigen." }
    ],
    cs: [
        { title: "Znečištění plasty", content: "Každý rok se do oceánů dostane více než 8 milionů tun plastů. Je to jako vysypat do vody plný popelářský vůz každou minutu." },
        { title: "Koloběh vody", content: "Voda, kterou dnes pijete, je tatáž voda, kterou pili dinosauři. Voda na Zemi se neustále recykluje." },
        { title: "Mikroplasty", content: "Mikroplasty jsou drobné plastové částice, které škodí mořskému životu. Často pocházejí z větších plastových odpadů a kosmetiky." },
        { title: "Ropné skvrny", content: "Ropné skvrny brání pronikání slunečního světla a kyslíku do vody, což může být zničující pro vodní rostliny a živočichy." },
        { title: "Říční ekosystémy", content: "Zdravé řeky jsou životně důležité pro biodiverzitu a poskytují domov nesčetným druhům ryb, hmyzu a rostlin." },
        { title: "Chemické splachy", content: "Pesticidy a chemikálie z farem a měst se mohou dostat do řek, otrávit vodu a poškodit divokou zvěř." }
    ],
};