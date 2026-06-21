package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Idcardrequeststatus {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
    @JsonIgnore
    @OneToMany(mappedBy = "idcardrequeststatus")
    private Collection<Idcardrequest> idcardrequests;

    public Integer getId() {
        return id;
    }

    public Idcardrequeststatus() {

    }

    public Idcardrequeststatus(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Idcardrequeststatus that = (Idcardrequeststatus) o;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    public Collection<Idcardrequest> getIdcardrequests() {
        return idcardrequests;
    }

    public void setIdcardrequests(Collection<Idcardrequest> idcardrequests) {
        this.idcardrequests = idcardrequests;
    }
}
