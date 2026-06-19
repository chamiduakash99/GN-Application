package lk.earth.earthuniversity.dao;
import lk.earth.earthuniversity.entity.Street;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StreetDao extends JpaRepository<Street,Integer> {

    Street findByCodename(String code);}
