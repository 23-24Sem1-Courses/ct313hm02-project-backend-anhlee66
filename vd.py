=T100+IF(T100=1,
        IF(RAND()<0.4,
            0,
            IF(RAND()<0.7,
            1,
            2)
        ),
        IF(T100=2,
            IF(RAND()<0.7,
            RANDBETWEEN(-1,1),
            RANDBETWEEN(0,2)
            ),
            IF(T100=3,
                IF(RAND()<0.1,
                    -2,
                    IF(RAND()<0.7,
                        RANDBETWEEN(-1,1),
                        RANDBETWEEN(0,2))
                ),
                IF(T100=4,
                    IF(RAND()<0.2,
                        -2,
                        IF(RAND()<0.4,
                        1,
                        RANDBETWEEN(-1,0)
                        )
                    ),
                    IF(RAND()<0.3,0,-1)
                )
            )
        )
)


