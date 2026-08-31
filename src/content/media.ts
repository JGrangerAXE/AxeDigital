export type AxeMediaAsset = {
  src: string;
  alt: string;
  position?: string;
};

export const axeMedia = {
  excavatorsWide: {
    src: "/media/PXL_20260714_191313681.jpg",
    alt: "Two CAT excavators on an active Axe Build construction site",
    position: "center 52%",
  },
  crewRebar: {
    src: "/media/PXL_20260714_191153067.jpg",
    alt: "Construction crew working around rebar grid and concrete formwork",
    position: "center 18%",
  },
  gradedSite: {
    src: "/media/PXL_20260714_191345379.jpg",
    alt: "Graded construction site with compact equipment at work",
    position: "center 55%",
  },
  excavatorsPortrait: {
    src: "/media/PXL_20260714_191432454.jpg",
    alt: "Excavators positioned on a dirt construction site",
    position: "center 48%",
  },
  telehandlerEntry: {
    src: "/media/PXL_20260714_162131503.jpg",
    alt: "Axe Build-branded telehandler entering an industrial building",
    position: "center 56%",
  },
  telehandlerDetail: {
    src: "/media/PXL_20260714_162154273.jpg",
    alt: "Axe Build branding on heavy equipment at work",
    position: "center 48%",
  },
  liftsRaised: {
    src: "/media/PXL_20260714_190517710.jpg",
    alt: "Raised scissor lifts inside a large industrial work bay",
    position: "center 36%",
  },
  liftsBay: {
    src: "/media/PXL_20260714_190519589.jpg",
    alt: "Access equipment lined up inside a long industrial bay",
    position: "center 42%",
  },
  fabricatedBeam: {
    src: "/media/PXL_20260714_153458525.jpg",
    alt: "Large fabricated steel beam and worker inside the Axe Build shop",
    position: "center 48%",
  },
  shopWide: {
    src: "/media/PXL_20260714_161140306.jpg",
    alt: "Wide Axe Build fabrication shop with machinery, steel, and material-handling equipment",
    position: "center 54%",
  },
  plasmaCutting: {
    src: "/media/PXL_20260714_161517684.jpg",
    alt: "Plasma cutting torch actively cutting a steel plate",
    position: "center 52%",
  },
  steelMachine: {
    src: "/media/PXL_20260714_161622764.jpg",
    alt: "Large automated steel processing machine inside the Axe Build shop",
    position: "center 46%",
  },
  steelStock: {
    src: "/media/PXL_20260714_161114976.jpg",
    alt: "Long structural steel members staged for production",
    position: "center 55%",
  },
  weldingEquipment: {
    src: "/media/PXL_20260714_153525906.jpg",
    alt: "Axe Build welding equipment ready for shop work",
    position: "center 50%",
  },
} satisfies Record<string, AxeMediaAsset>;
