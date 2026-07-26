package lk.earth.earthuniversity.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
public class Income {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;


    @Basic
    @Column(name = "monthlyaverageincome", precision = 12, scale = 2)
    private BigDecimal monthlyaverageincome;


    @Basic
    @Column(name = "incomesource", length = 100)
    private String incomesource;


    @ManyToOne
    @JoinColumn(
            name = "citizen_id",
            referencedColumnName = "id",
            nullable = false
    )
    private Citizen citizen;


    public Income() {
    }


    public Income(Integer id, BigDecimal monthlyaverageincome, String incomesource) {
        this.id = id;
        this.monthlyaverageincome = monthlyaverageincome;
        this.incomesource = incomesource;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public BigDecimal getMonthlyaverageincome() {
        return monthlyaverageincome;
    }

    public void setMonthlyaverageincome(BigDecimal monthlyaverageincome) {
        this.monthlyaverageincome = monthlyaverageincome;
    }


    public String getIncomesource() {
        return incomesource;
    }

    public void setIncomesource(String incomesource) {
        this.incomesource = incomesource;
    }


    public Citizen getCitizen() {
        return citizen;
    }

    public void setCitizen(Citizen citizen) {
        this.citizen = citizen;
    }


    @Override
    public boolean equals(Object o) {

        if (this == o) return true;

        if (o == null || getClass() != o.getClass())
            return false;

        Income income = (Income) o;

        return Objects.equals(id, income.id);
    }


    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

//package lk.earth.earthuniversity.entity;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//
//import javax.persistence.*;
//import java.util.Collection;
//import java.util.Objects;
//
//@Entity
//public class Income {
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Id
//    @Column(name = "id")
//    private Integer id;
//    @Basic
//    @Column(name = "name")
//    private String name;
//    @JsonIgnore
//    @OneToMany(mappedBy = "citizenstatus")
//    private Collection<Citizen> citizensById;
//
//    public  Integer getId() {
//        return id;
//    }
//
//    public void setId(Integer id) {
//        this.id = id;
//    }
//
//    public  String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        Income that = (Income) o;
//        return Objects.equals(id, that.id) && Objects.equals(name, that.name);
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(id, name);
//    }
//
//    public Collection<Citizen> getCitizensById() {
//        return citizensById;
//    }
//
//    public void setCitizensById(Collection<Citizen> citizensById) {
//        this.citizensById = citizensById;
//    }
//}
