package lk.earth.earthuniversity.entity;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class Building {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "no")
    private String no;

    @ManyToOne
    @JoinColumn(name = "ownershipType_id", referencedColumnName = "id", nullable = false)
    private Ownershiptype ownershiptype;
    @ManyToOne
    @JoinColumn(name = "Usage_id", referencedColumnName = "id", nullable = false)
    private Usage usage;
    @ManyToOne
    @JoinColumn(name = "buildingType_id", referencedColumnName = "id", nullable = false)
    private Buildingtype buildingtype;
    @ManyToOne
    @JoinColumn(name = "wallType_id", referencedColumnName = "id", nullable = false)
    private Walltype walltype;
    @ManyToOne
    @JoinColumn(name = "floorType_id", referencedColumnName = "id", nullable = false)
    private Floortype floortype;
    @ManyToOne
    @JoinColumn(name = "roofType_id", referencedColumnName = "id", nullable = false)
    private Rooftype rooftype;
    @ManyToOne
    @JoinColumn(name = "landDetail_id", referencedColumnName = "id", nullable = false)
    private Landdetail landdetail;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Building building = (Building) o;
        return Objects.equals(id, building.id) && Objects.equals(no, building.no);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, no);
    }

    public Ownershiptype getOwnershiptype() {
        return ownershiptype;
    }

    public void setOwnershiptype(Ownershiptype ownershiptype) {
        this.ownershiptype = ownershiptype;
    }

    public Usage getUsage() {
        return usage;
    }

    public void setUsage(Usage usage) {
        this.usage = usage;
    }

    public Buildingtype getBuildingtype() {
        return buildingtype;
    }

    public void setBuildingtype(Buildingtype buildingtype) {
        this.buildingtype = buildingtype;
    }

    public Walltype getWalltype() {
        return walltype;
    }

    public void setWalltype(Walltype walltype) {
        this.walltype = walltype;
    }

    public Floortype getFloortype() {
        return floortype;
    }

    public void setFloortype(Floortype floortype) {
        this.floortype = floortype;
    }

    public Rooftype getRooftype() {
        return rooftype;
    }

    public void setRooftype(Rooftype rooftype) {
        this.rooftype = rooftype;
    }

    public Landdetail getLanddetail() {
        return landdetail;
    }

    public void setLanddetail(Landdetail landdetail) {
        this.landdetail = landdetail;
    }
}
