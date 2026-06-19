package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Landdetail {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "deedno", unique = true)
    private String deedno;
    @JsonIgnore
    @OneToMany(mappedBy = "landdetail")
    private Collection<Building> buildings;
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
    @Column(name = "remarks")
    private String remarks;
    @Basic
    @Column(name = "image")
    private byte[] image;
    @Basic
    @Column(name = "deed")
    private byte[] deed;
    @ManyToOne
    @JoinColumn(name = "citizen_id", referencedColumnName = "id", nullable = false)
    private Citizen citizen;
    @ManyToOne
    @JoinColumn(name = "landtype_id", referencedColumnName = "id", nullable = false)
    private Landtype landtype;
    @ManyToOne
    @JoinColumn(name = "fencetype_id", referencedColumnName = "id", nullable = false)
    private Fencetype fencetype;
    @ManyToOne
    @JoinColumn(name = "street_id", referencedColumnName = "id", nullable = false)
    private Street street;
    @OneToMany(mappedBy = "landdetail")
    private Collection<LandfeatureHasLanddetail> landfeaturedetails;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDeedno() {return deedno;}

    public void setDeedno(String deedno) {this.deedno = deedno;}



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Landdetail that = (Landdetail) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }



    public Collection<Building> getBuildings() {
        return buildings;
    }

    public void setBuildings(Collection<Building> buildingsById) {
        this.buildings = buildingsById;
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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
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

    public Citizen getCitizen() {
        return citizen;
    }

    public void setCitizen(Citizen citizen) {
        this.citizen = citizen;
    }

    public Landtype getLandtype() {
        return landtype;
    }

    public void setLandtype(Landtype landtype) {
        this.landtype = landtype;
    }

    public Fencetype getFencetype() {
        return fencetype;
    }

    public void setFencetype(Fencetype fencetype) {
        this.fencetype = fencetype;
    }

    public Street getStreet() {
        return street;
    }

    public void setStreet(Street street) {
        this.street = street;
    }

    public Collection<LandfeatureHasLanddetail> getLandfeaturedetails() {
        return landfeaturedetails;
    }

    public void setLandfeaturedetails(Collection<LandfeatureHasLanddetail> landfeaturedetail) {
        this.landfeaturedetails = landfeaturedetail;
    }
}
