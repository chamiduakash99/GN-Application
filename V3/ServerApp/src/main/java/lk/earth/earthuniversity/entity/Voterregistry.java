package lk.earth.earthuniversity.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;

@Entity
public class Voterregistry {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "serialno")
    private Integer serialno;

    @Basic
    @Column(name = "registereddate")
    private Date registereddate;

    @ManyToOne
    @JoinColumn(name = "citizen_id", referencedColumnName = "id", nullable = false)
    private Citizen citizen;

    @ManyToOne
    @JoinColumn(name = "household_id", referencedColumnName = "id", nullable = false)
    private Household household;

    public Voterregistry() {}

    public Voterregistry(Integer id, Integer serialno, Date registereddate,
                         Citizen citizen, Household household) {
        this.id = id;
        this.serialno = serialno;
        this.registereddate = registereddate;
        this.citizen = citizen;
        this.household = household;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getSerialno() { return serialno; }
    public void setSerialno(Integer serialno) { this.serialno = serialno; }

    public Date getRegistereddate() { return registereddate; }
    public void setRegistereddate(Date registereddate) { this.registereddate = registereddate; }

    public Citizen getCitizen() { return citizen; }
    public void setCitizen(Citizen citizen) { this.citizen = citizen; }

    public Household getHousehold() { return household; }
    public void setHousehold(Household household) { this.household = household; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Voterregistry that = (Voterregistry) o;
        return Objects.equals(id, that.id) && Objects.equals(serialno, that.serialno);
    }

    @Override
    public int hashCode() { return Objects.hash(id, serialno); }
}