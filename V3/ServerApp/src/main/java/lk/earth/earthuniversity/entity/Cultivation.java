package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Cultivation {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "cultivationno")
    private String cultivationno;

    @Basic
    @Column(name = "cultivatedarea", precision = 10, scale = 2)
    private BigDecimal cultivatedarea;

    @Basic
    @Column(name = "plantingdate")
    private Date plantingdate;

    @Basic
    @Column(name = "expectedharvestdate")
    private Date expectedharvestdate;

    @Basic
    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    // ── FK relations ──────────────────────────────────────────────────────────
    @ManyToOne
    @JoinColumn(name = "landdetail_id", referencedColumnName = "id", nullable = false)
    private Landdetail landdetail;

    @ManyToOne
    @JoinColumn(name = "citizen_id", referencedColumnName = "id", nullable = false)
    private Citizen citizen;

    @ManyToOne
    @JoinColumn(name = "croptype_id", referencedColumnName = "id", nullable = false)
    private Croptype croptype;

    @ManyToOne
    @JoinColumn(name = "cultivationstatus_id", referencedColumnName = "id", nullable = false)
    private Cultivationstatus cultivationstatus;

    @ManyToOne
    @JoinColumn(name = "areaunit_id", referencedColumnName = "id", nullable = false)
    private Areaunit areaunit;

    // ── One cultivation → many harvests ───────────────────────────────────────
    @JsonIgnore
    @OneToMany(mappedBy = "cultivation")
    private Collection<Harvest> harvests;

    public Cultivation() {}

    public Cultivation(Integer id, String cultivationno) {
        this.id = id;
        this.cultivationno = cultivationno;
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCultivationno() { return cultivationno; }
    public void setCultivationno(String cultivationno) { this.cultivationno = cultivationno; }

    public BigDecimal getCultivatedarea() { return cultivatedarea; }
    public void setCultivatedarea(BigDecimal cultivatedarea) { this.cultivatedarea = cultivatedarea; }

    public Date getPlantingdate() { return plantingdate; }
    public void setPlantingdate(Date plantingdate) { this.plantingdate = plantingdate; }

    public Date getExpectedharvestdate() { return expectedharvestdate; }
    public void setExpectedharvestdate(Date expectedharvestdate) { this.expectedharvestdate = expectedharvestdate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Landdetail getLanddetail() { return landdetail; }
    public void setLanddetail(Landdetail landdetail) { this.landdetail = landdetail; }

    public Citizen getCitizen() { return citizen; }
    public void setCitizen(Citizen citizen) { this.citizen = citizen; }

    public Croptype getCroptype() { return croptype; }
    public void setCroptype(Croptype croptype) { this.croptype = croptype; }

    public Cultivationstatus getCultivationstatus() { return cultivationstatus; }
    public void setCultivationstatus(Cultivationstatus cultivationstatus) { this.cultivationstatus = cultivationstatus; }

    public Areaunit getAreaunit() { return areaunit; }
    public void setAreaunit(Areaunit areaunit) { this.areaunit = areaunit; }

    public Collection<Harvest> getHarvests() { return harvests; }
    public void setHarvests(Collection<Harvest> harvests) { this.harvests = harvests; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Cultivation that = (Cultivation) o;
        return Objects.equals(id, that.id) && Objects.equals(cultivationno, that.cultivationno);
    }

    @Override
    public int hashCode() { return Objects.hash(id, cultivationno); }
}