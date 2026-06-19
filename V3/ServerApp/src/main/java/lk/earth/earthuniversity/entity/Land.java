package lk.earth.earthuniversity.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collection;

@Entity
@Table(name = "land")
public class Land {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "latitude")
    private BigDecimal latitude;
    @Basic
    @Column(name = "longitude")
    private BigDecimal longitude;
    @Basic
    @Column(name = "size")
    private Double size;
    @Basic
    @Column(name = "image")
    private byte[] image;
    @Basic
    @Column(name = "deed")
    private byte[] deed;
    @Basic
    @Column(name = "remarks")
    private String remarks;
    @ManyToOne
    @JoinColumn(name = "street_id", referencedColumnName = "id", nullable = false)
    private Street street;
    @ManyToOne
    @JoinColumn(name = "landtype_id", referencedColumnName = "id", nullable = false)
    private Landtype landtype;
    @ManyToOne
    @JoinColumn(name = "citizen_id", referencedColumnName = "id", nullable = false)
    private Citizen citizen;
    @ManyToOne
    @JoinColumn(name = "fencetype_id", referencedColumnName = "id", nullable = false)
    private Fencetype fencetype;
    @OneToMany(mappedBy = "land" ,cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Landfeaturedetails> landfeaturedetails;
//    @JsonIgnore
//    @OneToMany(mappedBy = "land")
//    private Collection<Building> buildings;
//    public Collection<Building> getBuildings() {
//        return buildings;
//    }
//
//    public void setBuildings(Collection<Building> buildings) {
//        this.buildings = buildings;
//    }
//    @JsonIgnore
//    @OneToMany(mappedBy = "land")
//    private Collection<Building> buildings;
//    public Collection<Building> getBuildings() {
//        return buildings;
//    }
//
//    public void setBuildings(Collection<Building> buildingsById) {
//        this.buildings = buildingsById;
//    }
//    @JsonIgnore
//    @OneToMany(mappedBy = "land")
//    private Collection<Building> buildings;
//    public Collection<Building> getBuildings() {
//        return buildings;
//    }
//
//    public void setBuildings(Collection<Building> buildingsById) {
//        this.buildings = buildingsById;
//    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public Double getSize() {
        return size;
    }

    public void setSize(Double size) {
        this.size = size;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
            this.image = image;
    }

    public byte[] getDeed() {
        return deed;
    }

    public void setDeed(byte[] deed) {
        this.deed = deed;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Land land = (Land) o;

        if (id != land.id) return false;
        if (latitude != null ? !latitude.equals(land.latitude) : land.latitude != null) return false;
        if (longitude != null ? !longitude.equals(land.longitude) : land.longitude != null) return false;
        if (size != null ? !size.equals(land.size) : land.size != null) return false;
        if (!Arrays.equals(image, land.image)) return false;
        if (!Arrays.equals(deed, land.deed)) return false;
        if (remarks != null ? !remarks.equals(land.remarks) : land.remarks != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (latitude != null ? latitude.hashCode() : 0);
        result = 31 * result + (longitude != null ? longitude.hashCode() : 0);
        result = 31 * result + (size != null ? size.hashCode() : 0);
        result = 31 * result + Arrays.hashCode(image);
        result = 31 * result + Arrays.hashCode(deed);
        result = 31 * result + (remarks != null ? remarks.hashCode() : 0);
        return result;
    }

    public Street getStreet() {
        return street;
    }

    public void setStreet(Street street) {
        this.street = street;
    }

    public Landtype getLandtype() {
        return landtype;
    }

    public void setLandtype(Landtype landtype) {
        this.landtype = landtype;
    }

    public Citizen getCitizen() {
        return citizen;
    }

    public void setCitizen(Citizen citizen) {
        this.citizen = citizen;
    }

    public Fencetype getFencetype() {
        return fencetype;
    }

    public void setFencetype(Fencetype fencetype) {
        this.fencetype = fencetype;
    }

    public Collection<Landfeaturedetails> getLandfeaturedetails() {
        return landfeaturedetails;
    }

    public void setLandfeaturedetails(Collection<Landfeaturedetails> landfeaturedetails) {
        this.landfeaturedetails = landfeaturedetails;
    }


}
