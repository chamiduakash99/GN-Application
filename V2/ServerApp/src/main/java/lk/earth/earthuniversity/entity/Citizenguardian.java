package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class Citizenguardian {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "relationshipType_id", referencedColumnName = "id", nullable = false)
    private Relationshiptype relationshiptype;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "citizen_id", referencedColumnName = "id", nullable = false)
    private Citizen citizen;

    @ManyToOne
    @JoinColumn(name = "citizenparent", referencedColumnName = "id", nullable = false)
    private Citizen citizenparent;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Citizenguardian that = (Citizenguardian) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public Relationshiptype getRelationshiptype() {
        return relationshiptype;
    }

    public void setRelationshiptype(Relationshiptype relationshiptype) {
        this.relationshiptype = relationshiptype;
    }

    public Citizen getCitizen() {
        return citizen;
    }

    public void setCitizen(Citizen citizen) {
        this.citizen = citizen;
    }

    public Citizen getCitizenparent() {
        return citizenparent;
    }

    public void setCitizenparent(Citizen citizenparent) {
        this.citizenparent = citizenparent;
    }
}
