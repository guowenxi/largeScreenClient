export function clusterLayer() {
    return {
        _clusterResolution : 0.0005866455078125,
        _clusterTolerance : 80,
        _clusterData : [],
        _clusters : [],
        _extent: [],
        _checkAll:true,
        _checkedList:[],
        _checkedKey:'',
        _selectedId:null,
        _clusterType:1,
        _clusterGraphics: function() {
            // first time through, loop through the points
            for ( let j = 0, jl = this._clusterData.length; j < jl; j++ ) {
                // see if the current feature should be added to a cluster
                let point = this._clusterData[j];
                if(point == null){
                    continue;
                }
                if(!this._checkAll){
                    //若没有全选显示
                    let notShow = true;
                    if(this._subType === 2){
                        //匹配类型为模糊匹配时
                        this._checkedList.forEach((item) => {
                            if(point[this._checkedKey].indexOf(item) >= 0){
                                notShow = false;
                            }
                        });
                    }else{
                        //匹配类型为相等时
                        if(this._checkedList.indexOf(point[this._checkedKey]) >= 0){
                            notShow = false;
                        }
                    }
                    if(notShow){
                        continue;
                    }
                }
                let clustered = false;
                if(!point.isSingle && this._selectedId !== point.id){
                    for ( let i = 0; i < this._clusters.length; i++ ) {
                        let c = this._clusters[i];
                        if(c.single || this._selectedId === c.id){
                            continue;
                        }
                        if(this._clusterType === 1){
                            if ( this._clusterTest(point, c) ) {
                                this._clusterAddPoint(point, c);
                                clustered = true;
                                break;
                            }
                        }else{
                            if (point.x == c.x && point.y == c.y) {//eslint-disable-line
                                // this._clusterAddPoint(point, c);
                                c.attributes.clusterCount ++;
                                clustered = true;
                                break;
                            }
                        }
                    }
                }

                if ( ! clustered) {
                    this._clusterCreate(point);
                }
            }
        },
        _clusterTest: function(p, cluster) {
            let distance = (
                Math.sqrt(
                    Math.pow((cluster.x - p.x), 2) + Math.pow((cluster.y - p.y), 2)
                ) / this._clusterResolution
            );
            return (distance <= this._clusterTolerance);
        },
        _clusterAddPoint: function(p, cluster) {
            // average in the new point to the cluster geometry
            let count, x, y;
            count = cluster.attributes.clusterCount;
            x = (parseFloat(p.x) + (cluster.x * count)) / (count + 1);
            y = (parseFloat(p.y) + (cluster.y * count)) / (count + 1);
            cluster.x = x;
            cluster.y = y;

            // build an extent that includes all points in a cluster
            // extents are for debug/testing only...not used by the layer
            if ( p.x < cluster.attributes.extent[0] ) {
                cluster.attributes.extent[0] = p.x;
            } else if ( p.x > cluster.attributes.extent[2] ) {
                cluster.attributes.extent[2] = p.x;
            }
            if ( p.y < cluster.attributes.extent[1] ) {
                cluster.attributes.extent[1] = p.y;
            } else if ( p.y > cluster.attributes.extent[3] ) {
                cluster.attributes.extent[3] = p.y;
            }

            // increment the count
            cluster.attributes.clusterCount++;
            // attributes might not exist
            if ( ! p.hasOwnProperty("attributes") ) {
                p.attributes = {};
            }
            // give the graphic a cluster id
            p.attributes.clusterId = cluster.attributes.clusterId;
        },
        _clusterCreate: function(p) {
            let clusterId = this._clusters.length + 1;
            // console.log("cluster create, id is: ", clusterId);
            // p.attributes might be undefined
            if ( ! p.attributes ) {
                p.attributes = {};
            }
            p.attributes.clusterId = clusterId;
            // create the cluster
            let cluster = {
                ...p,
                "x": p.x,
                "y": p.y,
                "image": p.image,
                "attributes" : {
                    "clusterCount": 1,
                    "clusterId": clusterId,
                    "extent": [ p.x, p.y, p.x, p.y ],
                }
            };
            if(this._singleId === p.id || p.isSingle){
                cluster.single = true;
            }
            this._clusters.push(cluster);
        },

    };
}