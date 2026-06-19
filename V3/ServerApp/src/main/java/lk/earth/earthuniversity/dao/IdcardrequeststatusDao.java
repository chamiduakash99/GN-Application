package lk.earth.earthuniversity.dao;
import lk.earth.earthuniversity.entity.Idcardrequeststatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IdcardrequeststatusDao
        extends JpaRepository<Idcardrequeststatus, Integer> {

    @Query("select s from Idcardrequeststatus s where s.id = :id")
    Idcardrequeststatus findByMyId(Integer id);


    @Query("select s from Idcardrequeststatus s")
    List<Idcardrequeststatus> findAllNameId();

}