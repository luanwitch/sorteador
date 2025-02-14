module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Limpa os diretórios antes da build
        clean: { 
            dev: ['dev/'],
            dist: ['dist/', 'prebuild/']
        },

        // Compila LESS para CSS
        less: { 
            development: { 
                files: {
                    'dev/styles/main.css': 'src/styles/main.less'
                }
            }, 
            production: { 
                options: { 
                    compress: true
                },
                files: { 
                    'dist/styles/main.min.css': 'src/styles/main.less'
                }
            }
        },

        // Substituições nos arquivos HTML
        replace: { 
            dev: { 
                options: { 
                    prefix: '@@',
                    patterns: [
                        { match: 'ENDERECO_DO_JS', replacement: '..src/scripts/main.js' },
                        { match: 'ENDERECO_DO_CSS', replacement: 'main.css' }
                    ]
                },
                files: [
                    { expand: true, flatten: true, src: ['src/index.html'], dest: 'dev/styles/' }
                ]
            },
            dist: { 
                options: { 
                    prefix: '@@',
                    patterns: [
                        { match: 'ENDERECO_DO_CSS', replacement: 'styles/main.min.css' },
                        { match: 'ENDERECO_DO_JS', replacement: 'scripts/main.min.js' }
                    ]
                },
                files: [
                    { expand: true, flatten: true, src: ['prebuild/index.html'], dest: 'dist/' }
                ]
            }
        },

        // Minificação do HTML
        htmlmin: { 
            dist: { 
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { 
                    'prebuild/index.html': 'src/index.html'
                }
            }
        },

        // Cópia de arquivos JS e CSS
        copy: {
            dev: {
                files: [
                    { expand: true, cwd: 'src/scripts/', src: ['**'], dest: 'dev/scripts/' },
                    { expand: true, cwd: 'src/styles/', src: ['**'], dest: 'dev/styles/' }
                ]
            },
            dist: {
                files: [
                    { 
                        expand: true, 
                        cwd: 'src/scripts/', 
                        src: ['main.js'], 
                        dest: 'dist/scripts/', 
                        rename: function(dest, src) { 
                            return dest + src.replace('.js', '.min.js'); 
                        } 
                    },
                    { 
                        expand: true, 
                        cwd: 'dist/styles/', 
                        src: ['main.min.css'], 
                        dest: 'dist/styles/' 
                    }
                ]
            }
        },

        // Watch para desenvolvimento
        watch: { 
            less: { 
                files: ['src/styles/**/*.less'], 
                tasks: ['less:development'] 
            },
            replace: { 
                files: ['src/index.html'],
                tasks: ['replace:dev'] 
            },
            scripts: { 
                files: ['src/scripts/**/*.js'], 
                tasks: ['copy:dev'] 
            },
            html: { 
                files: ['src/index.html'], 
                tasks: ['replace:dev'] 
            }
        }
    });

    // Plugins do Grunt
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Tarefa padrão para desenvolvimento
    grunt.registerTask('default', ['watch']);

    // Tarefa de build para produção
    grunt.registerTask('build', [
        'clean:dist',
        'less:production',
        'htmlmin:dist',
        'replace:dist',
        'copy:dist'
    ]);
};
