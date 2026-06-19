package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Usage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsageDao extends JpaRepository<Usage, Integer> {

    Usage findByName(String name);

}