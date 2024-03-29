---
date: 2019-04-11
title: Carto TB
description: Cartographie des zones à très haut risque de tuberculose
featured_image: "/images/default-feat-image.jpg"
toc: true
---

L’Organisation Mondiale de la Santé (OMS) estime qu’une partie importante des malades atteints de la tuberculose (TB) n’ont pas accès à un test diagnostic et au traitement. Cette proportion de malades non-diagnostiqués, qui peut atteindre plus de la moitié des cas de tuberculose dans certaines parties du monde, contribue largement à la mortalité liée à la TB et à sa propagation.

Pour cette raison, l’OMS recommande de réaliser des activités de dépistage actif de la TB dans les populations à haut risque. Ces populations sont traditionnellement définies comme étant les personnes qui ont eu un contact rapproché avec un patient présentant une tuberculose pulmonaire active. Cependant, il a été démontré dans plusieurs études que plus de deux-tiers des transmissions se déroulaient en-dehors de ce cadre familial ou professionnel. Il est donc nécessaire de développer des stratégies innovantes pour cibler de façon précises les populations à très haut risque.

Des chercheurs de l’UCLouvain et de la KU Leuven ont développé une approche pour mieux aider les acteurs locaux (programmes nationaux, organisations non-gouvernementales, organisations communautaires locales). Cette approche consiste à développer des cartes qui prédisent de manière précises des zones géographiques dans lesquelles l’incidence de la tuberculose est la plus élevée.

Une description précise des mécanismes qui sous-tendent ces cartes peut être trouvée dans :

> **Data-driven identification of communities with high levels of tuberculosis infection in the Democratic Republic of Congo**<br>
> *Mauro Faccin, Olivier Rusumba, Alfred Ushindi, Mireille Riziki, Tresor Habiragi, Fairouz Boutachkourt & Emmanuel André* <br>
> [Scientific Reports](https://doi.org/10.1038/s41598-022-07633-2), **12**, 3912 (2022)

## Comment ces cartes sont construites?

Les cartes sont construites en combinant une série de données librement disponibles telles que les données démographiques ou la présence de groupes connus comme étant à haut risque (prisons, secteur minier, …) lorsque ces données sont disponibles.
Cette première couche est ensuite complémentées par une cartographie des centres de santé et les données de notification de la tuberculose pour chacun de ces centres.

{{< figure src="/images/example.png"
    class="i f6"
    alt="Example of risk map"
    caption="Exemple de carte des risques, les points rouges représentent les zones à plus forte présence de tuberculose."
    >}}

L’ensemble des cas de tuberculose notifiés au niveau d’un centre de santé est ensuite redistribué sur l’ensemble des habitations de la zone couverte par ce centre.

L’analyse applique un coefficient augmentant la probabilité de tuberculose pour des habitations présentant un groupe à haut risque reconnu (prison, activité minière) et/ou pour les habitations très éloignées du centre de santé (difficulté d’accès au système de santé).


## Comment utiliser ces cartes?

Les cartes délimitent des zones géographiques qui ont différents codes couleur qui représentent la probabilité d’avoir une incidence plus faible (zones blanches), ou plus élevée (zones oranges et rouges) de tuberculose en comparaison avec l’incidence nationale estimée par l’OMS.
A titre d’exemple, les zones rouges prédisent un risque 10 fois plus élevé de tuberculose que la moyenne nationale. Dans un pays où l’incidence nationale estimée est de 300 cas par 100.000 habitants et par an, on estime que 3% de la population développe une tuberculose active chaque année dans les zones rouges, 1,5% dans les zones orange foncées et moins de 0.3% dans les zones plus claires. Par comparaison, dans un pays dont l’incidence nationale estimée est plus faible (par exemple 50 cas par 100.000 habitants et par an), l’incidence dans les zones rouges sera également plus faible que dans un pays à très haute incidence. C’est pour cette raison que les cartes sont réalisées par pays.

Cet outil permet donc de cibler de manière précise les lieux qui devraient bénéficier en priorité d’une intensification des activités de dépistage, de prévention et de traitement de la tuberculose. Des outils permettant de planifier et d’implémenter ce type d’activités sur base d’une localisation géographique précise ont été développés par la société [Savics](https://www.savics.org ). Ce type d’outils peuvent être utilisés en complémentarité avec les cartes. Elles permettent notamment de suivre à distance le travail de dépistage actif effectué par des acteurs communautaires dans des régions reculés.

### Mon pays ou ma province n’est pas encore cartographiée

Nous sommes à la recherche de partenaires au travers le monde souhaitant collaborer pour la validation scientifique de notre approche. Durant la période 2019-2020, nous invitons tout organe officiel (programme national tuberculose ou coordination provinciale tuberculose) souhaitant collaborer dans ce sens à prendre contact avec nous dans le but de produire une cartographie des zones concernées et valider les données générées.

Pour toute utilisation de ces cartes en dehors de ce cadre précis (appels à projets, rapports d'activité, communications scientifiques), nous demandons de faire spécifiquement référence à ce site internet de la manière suivante: Faccin M, André E. Cartography of predicted tuberculosis hotspots in high burden settings.
Available at : [`https://maurofaccin.github.io/cartotb`](https://maurofaccin.github.io/cartotb)


## Limitations et évolution des cartes

Ces cartes ont pour but de prédire la localisation des zones avec une haute incidence de la tuberculose plus élevée que la moyenne nationale. Dans les pays à forte incidence de tuberculose, la tuberculose touche chaque zone, et un contrôle efficace de la maladie nécessite de renforcer et soutenir les activités de lutte contre la maladie y compris dans les zones où l’incidence prédite est plus faible.
Dans certains cas, il est possible que des zones à haute risque de TB ne soient pas répertoriées comme zone rouge. Cela peut être lié à un faible taux de dépistage historique dans ces zones précises. Il est donc important que ces cartes soient utilisées comme un outil de guidance, mais que les responsables des programmes tuberculose restent vigilants par rapport à la possibilité que certaines populations à haut risque peuvent exister ou émerger sans être détectées par ces cartes.

L’épidémiologie de tuberculose est appelée à évoluer, entre-autre grâce à la mise en place de programmes améliorant la qualité du dépistage et de la prise en charge des populations à haut risque. Par conséquent, la mise à jour annuelle de ces cartes est nécessaire pour ré-évaluer régulièrement l’impact de ces activités et l’émergence éventuelle de nouvelles zones prioritaires.

Contact des chercheurs:

- Dr [Mauro Faccin](mailto:mauro.fccn@gmail.com)
- Dr [Emmanuel André](mailto:emmanuel.andre@uzleuven.be)

## Une collaboration entre:

{{< figure src="/images/kuleuven_logo.png" class="center w-50-ns" alt="KULeuven LOGO" link="https://www.kuleuven.be" target="_blank">}}
{{< figure src="/images/uclouvain_logo.png" class="center w-50-ns" alt="UCLouvain LOGO" link="https://www.uclouvain.be" target="_blank">}}
{{< figure src="/images/savics_logo.png" class="center w-50-ns" alt="Savics LOGO" link="https://savics.org" target="_blank">}}

## Avec le soutien de:

{{< figure src="/images/innoviris_logo.png" class="center w-50-ns" alt="Innoviris LOGOs" link="http://www.innoviris.be" target="_blank">}}
