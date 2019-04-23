DEST=../content/region/
REGIONS=$(shell fd --type d .)

.PHONY: $(REGIONS)

all: ${REGIONS}
	echo ${REGIONS}
	cp countries.js ../content/

$(REGIONS):
	echo $@
	cat $@/map_data.js ./map.js > ${DEST}$@/map.js
	cp $@/data.js ${DEST}$@/data.js
	find $@ -type f -iname '*.png' -exec cp {} ${DEST}$@/ \;
