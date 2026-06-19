package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collection;

@Entity
public class Street {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "codename")
    private String codename;
    @Basic
    @Column(name = "fullname")
    private String fullname;
    @Basic
    @Column(name = "mapimage")
    private byte[] mapimage;
    @Basic
    @Column(name = "startlatitude")
    private BigDecimal startlatitude;
    @Basic
    @Column(name = "startlongitude")
    private BigDecimal startlongitude;
    @Basic
    @Column(name = "endlatitude")
    private BigDecimal endlatitude;
    @Basic
    @Column(name = "endlongitude")
    private BigDecimal endlongitude;
    @Basic
    @Column(name = "length")
    private BigDecimal length;
    @Basic
    @Column(name = "width")
    private BigDecimal width;
    @ManyToOne
    @JoinColumn(name = "streetstatus_id", referencedColumnName = "id", nullable = false)
    private Streetstatus streetstatus;
    @ManyToOne
    @JoinColumn(name = "streettype_id", referencedColumnName = "id", nullable = false)
    private Streettype streettype;
    @ManyToOne
    @JoinColumn(name = "streetmatierial_id", referencedColumnName = "id", nullable = false)
    private Streetmatierial streetmatierial;
    @JsonIgnore
    @OneToMany(mappedBy = "street")
    private Collection<Land> lands;
    @ManyToOne
    @JoinColumn(name = "gnd_id", referencedColumnName = "id", nullable = false)
    private Gnd gnd;
    @JsonIgnore
    @OneToMany(mappedBy = "street")
    private Collection<Landdetail> landdetails;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCodename() {
        return codename;
    }

    public void setCodename(String codename) {
        this.codename = codename;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public byte[] getMapimage() {
        return mapimage;
    }

    public void setMapimage(byte[] mapimage) {
        this.mapimage = mapimage;
    }

    public BigDecimal getStartlatitude() {
        return startlatitude;
    }

    public void setStartlatitude(BigDecimal startlatitude) {
        this.startlatitude = startlatitude;
    }

    public BigDecimal getStartlongitude() {
        return startlongitude;
    }

    public void setStartlongitude(BigDecimal startlongitude) {
        this.startlongitude = startlongitude;
    }

    public BigDecimal getEndlatitude() {
        return endlatitude;
    }

    public void setEndlatitude(BigDecimal endlatitude) {
        this.endlatitude = endlatitude;
    }

    public BigDecimal getEndlongitude() {
        return endlongitude;
    }

    public void setEndlongitude(BigDecimal endlongitude) {
        this.endlongitude = endlongitude;
    }

    public BigDecimal getLength() {
        return length;
    }

    public void setLength(BigDecimal length) {
        this.length = length;
    }

    public BigDecimal getWidth() {
        return width;
    }

    public void setWidth(BigDecimal width) {
        this.width = width;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Street street = (Street) o;

        if (id != street.id) return false;
        if (codename != null ? !codename.equals(street.codename) : street.codename != null) return false;
        if (fullname != null ? !fullname.equals(street.fullname) : street.fullname != null) return false;
        if (!Arrays.equals(mapimage, street.mapimage)) return false;
        if (startlatitude != null ? !startlatitude.equals(street.startlatitude) : street.startlatitude != null)
            return false;
        if (startlongitude != null ? !startlongitude.equals(street.startlongitude) : street.startlongitude != null)
            return false;
        if (endlatitude != null ? !endlatitude.equals(street.endlatitude) : street.endlatitude != null) return false;
        if (endlongitude != null ? !endlongitude.equals(street.endlongitude) : street.endlongitude != null)
            return false;
        if (length != null ? !length.equals(street.length) : street.length != null) return false;
        if (width != null ? !width.equals(street.width) : street.width != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (codename != null ? codename.hashCode() : 0);
        result = 31 * result + (fullname != null ? fullname.hashCode() : 0);
        result = 31 * result + Arrays.hashCode(mapimage);
        result = 31 * result + (startlatitude != null ? startlatitude.hashCode() : 0);
        result = 31 * result + (startlongitude != null ? startlongitude.hashCode() : 0);
        result = 31 * result + (endlatitude != null ? endlatitude.hashCode() : 0);
        result = 31 * result + (endlongitude != null ? endlongitude.hashCode() : 0);
        result = 31 * result + (length != null ? length.hashCode() : 0);
        result = 31 * result + (width != null ? width.hashCode() : 0);
        return result;
    }

    public Streetstatus getStreetstatus() {
        return streetstatus;
    }

    public void setStreetstatus(Streetstatus streetstatus) {
        this.streetstatus = streetstatus;
    }

    public Streettype getStreettype() {
        return streettype;
    }

    public void setStreettype(Streettype streettype) {
        this.streettype = streettype;
    }

    public Streetmatierial getStreetmatierial() {
        return streetmatierial;
    }

    public void setStreetmatierial(Streetmatierial streetmatierial) {
        this.streetmatierial = streetmatierial;
    }

    public Collection<Land> getLands() {
        return lands;
    }

    public void setLands(Collection<Land> lands) {
        this.lands = lands;
    }

    public Gnd getGnd() {
        return gnd;
    }

    public void setGnd(Gnd gnd) {
        this.gnd = gnd;
    }

    public Collection<Landdetail> getLanddetails() {
        return landdetails;
    }

    public void setLanddetails(Collection<Landdetail> landdetails) {
        this.landdetails = landdetails;
    }
}
